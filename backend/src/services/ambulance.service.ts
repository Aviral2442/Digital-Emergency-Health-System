import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";

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
                booking_view.created_at
            FROM booking_view
            ${finalWhereSQL}
            WHERE booking_view.booking_status != 0
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