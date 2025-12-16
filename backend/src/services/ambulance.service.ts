import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { FieldPacket, RowDataPacket } from 'mysql2';

// SERVICE TO GET TOTAL AMBULANCE BOOKING COUNT
export const ambulanceBookingCountService = async () => {
    try {
        const query = `
            SELECT 
            COUNT(booking_id) AS bookingTotalCount,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() THEN 1 END) AS today_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 1 DAY THEN 1 END) AS yesterday_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 2 DAY THEN 1 END) AS day_2_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 3 DAY THEN 1 END) AS day_3_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 4 DAY THEN 1 END) AS day_4_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 5 DAY THEN 1 END) AS day_5_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 6 DAY THEN 1 END) AS day_6_bookings
            FROM booking_view
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Total booking count fetched successfully",
            jsonData: {
                total_booking_count: rows[0]
            }
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Total Booking Count");
    }
};

// SERVICE TO GET COMPLETE, ONGOING, CANCEL & REMINDER BOOKING COUNTS
export const ambulanceCompleteOngoingCancelReminderBookingCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS completed_bookings,
            COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_bookings,
            COUNT(CASE WHEN booking_status = 5 THEN 1 END) AS cancelled_bookings
            FROM booking_view
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Booking status counts fetched successfully",
            jsonData: {
                completed_ongoing_cancelled_counts: rows[0]
            }
        };
    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Failed To Load Booking Counts");
    }
};

// SERVICE TO GET AMBULANCE BOOKING LIST WITH FILTERS AND PAGINATION
export const getAmbulanceBookingListService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "booking_view.created_at",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                enquery: "booking_view.booking_status = 0",
                confirmBooking: "booking_view.booking_status = 1",
                driverAssign: "booking_view.booking_status = 2",
                invoice: "booking_view.booking_status = 3",
                complete: "booking_view.booking_status = 4",
                cancel: "booking_view.booking_status = 5",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

        // Detect filters
        const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
        const isStatusFilterApplied = !!filters?.status;
        const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

        let effectiveLimit = limit;
        let effectiveOffset = offset;

        // If NO FILTERS applied → force fixed 100-record window
        if (noFiltersApplied) {
            effectiveLimit = limit;              // per page limit (e.g., 10)
            effectiveOffset = (page - 1) * limit; // correct pagination
        }

        const query = `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_view_category_name,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at,
                (
                    SELECT remark_text 
                    FROM remark_data 
                    WHERE remark_booking_id = booking_view.booking_id 
                    ORDER BY remark_id DESC 
                    LIMIT 1
                ) AS remark_text
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: "Ambulance booking list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                booking_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Ambulance Booking List Error On Fetching");
    }

};

// SERVICE TO GET AMBULANCE BOOKING DETAIL
export const ambulanceBookingDetailService = async (bookingId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT
            booking_view.*,
            driver.driver_name,
            driver.driver_last_name,
            driver.driver_mobile,
            vehicle.v_vehicle_name,
            vehicle.vehicle_rc_number
            FROM booking_view
            LEFT JOIN driver ON booking_view.booking_acpt_driver_id > 0 AND booking_view.booking_acpt_driver_id = driver.driver_id
            LEFT JOIN vehicle ON booking_view.booking_acpt_vehicle_id > 0 AND booking_view.booking_acpt_vehicle_id = vehicle.vehicle_id
            WHERE booking_view.booking_id = ?`,
            [bookingId]
        );
        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance booking not found");
        }
        return {
            status: 200,
            message: "Ambulance booking detail fetched successfully",
            jsonData: {
                booking_detail: rows[0]
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get Ambulance Booking Detail Error On Fetching");
    }
}

interface AmbulanceBookingData {
    booking_source: string;
    booking_type: number;
    booking_type_for_rental: number;
    booking_bulk_master_key: string;
    booking_no_of_bulk: number;
    booking_bulk_total: number;
    booking_by_cid: number;
    booking_view_otp: string;
    booking_view_status_otp: number;
    booking_con_name: string;
    booking_con_mobile: string;
    booking_category: number;
    booking_schedule_time: string;
    booking_pickup: string;
    booking_drop: string;
    booking_pickup_city: string;
    booking_drop_city: string;
    booking_pick_lat: string;
    booking_pick_long: string;
    booking_drop_lat: string;
    booking_drop_long: string;
    booking_amount: string;
    booking_adv_amount: string;
    booking_payment_type: string;
    booking_payment_method: string;
    booking_status: number;
    booking_distance: string;
    booking_duration: string;
    booking_duration_in_sec: string;
    booking_total_amount: string;
    booking_payment_status: number;
    booking_polyline: string;
    booking_acpt_driver_id: number;
    booking_acpt_vehicle_id: number;
    booking_acpt_time: string;
    booking_ap_polilyne: string;
    booking_ap_duration: string;
    booking_a_t_p_duration_in_sec: string;
    booking_ap_distance: string;
    booking_view_category_name: string;
    booking_view_category_icon: string;
    booking_view_base_rate: string;
    booking_view_km_till: string;
    booking_view_per_km_rate: string;
    booking_view_per_ext_km_rate: string;
    booking_view_per_ext_min_rate: string;
    booking_view_km_rate: string;
    booking_view_total_fare: string;
    booking_view_service_charge_rate: string;
    booking_view_service_charge_rate_discount: string;
    // booking_view_includes: string;
    // booking_view_pickup_time: string;
    // booking_view_arrival_time: string;
    // booking_view_dropped_time: string;
    // booking_view_rating_status: number;
    // booking_view_rating_c_to_d_status: number;
    // booking_radius: string;
    // created_at: string;
    // created_at_unix: number;
    // updated_at: string;
    booking_user_id: number;
    // bookingStatus: string;
    booking_generate_source: string; // -- IVR, app, web , whatsapp, live chat , direct call 
    // bv_virtual_number_status: number;
    // bv_virtual_number: string;
    // bv_cloud_con_crid: string;
    // bv_cloud_con_crid_c_to_d: string;
    // bv_shoot_time: string;
}