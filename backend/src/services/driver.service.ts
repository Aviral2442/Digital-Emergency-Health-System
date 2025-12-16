import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';

interface DriverData {
    driver_name?: string;
    driver_last_name?: string;
    driver_mobile?: string;
    driver_dob?: string;
    driver_gender?: string;
    driver_city_id?: number;
    driver_created_by?: number;
    driver_created_partner_id?: number | null;
    driver_auth_key?: string;
    partner_auth_key?: string;

    driver_profile_img?: Express.Multer.File;

    // Driver Details
    driver_details_dl_front_img?: Express.Multer.File;
    driver_details_dl_back_image?: Express.Multer.File;
    driver_details_dl_number?: string;

    driver_details_dl_exp_date?: string; // normal datetime
    driver_details_aadhar_front_img?: Express.Multer.File;
    driver_details_aadhar_back_img?: Express.Multer.File;
    driver_details_aadhar_number?: string;

    driver_details_pan_card_front_img?: Express.Multer.File;
    driver_details_pan_card_number?: string;

    driver_details_police_verification_image?: Express.Multer.File;
    driver_details_police_verification_date?: string; // normal datetime
}

// Get Driver List
export const getDriverService = async (filters: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'driver.created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "driver.driver_status = 0",
                active: "driver.driver_status = 1",
                inActive: "driver.driver_status = 2",
                delete: "driver.driver_status = 3",
                verification: "driver.driver_status = 4",
            };

            const condition = statusConsitionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

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
                driver.driver_id,
                driver.driver_name,
                driver.driver_last_name,
                driver.driver_mobile,
                driver.driver_wallet_amount,
                driver.driver_city_id,
                driver.driver_created_by, /* 0 for Self 1 for Partner */
                driver.driver_profile_img,
                driver.driver_registration_step,
                driver.driver_duty_status,
                driver.driver_status,
                driver.driver_duty_status,
                partner.partner_f_name AS created_partner_name,
                partner.partner_mobile AS created_partner_mobile,
                driver.created_at,
                (
                    SELECT remark_text
                    FROM remark_data
                    WHERE remark_driver_id = driver.driver_id
                    ORDER BY remark_id DESC
                    LIMIT 1
                ) AS remark_text
            FROM driver
            LEFT JOIN partner ON driver.driver_created_by = 1 AND driver.driver_created_partner_id = partner.partner_id
            ${finalWhereSQL}
            ORDER BY driver.driver_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM driver ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Drivers List Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                drivers: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers services');
    }

};

// Get Driver Detail
export const driverDetailService = async (driverId: number) => {

    try {

        const [rows]: any = await db.query(
            `
            SELECT 
            driver.*, driver_details.*, vehicle.v_vehicle_name, vehicle.vehicle_rc_number, vehicle.vehicle_category_type, city.city_name,
            partner.partner_f_name, partner.partner_l_name, partner.partner_mobile
            FROM driver 
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            LEFT JOIN city ON driver.driver_city_id = city.city_id
            LEFT JOIN partner ON driver.driver_created_by > 0 AND driver.driver_created_partner_id = partner.partner_id
            LEFT JOIN driver_details ON driver.driver_id = driver_details.driver_details_driver_id
            WHERE driver.driver_id = ?
            `, [driverId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Driver not found');
        }

        return {
            status: 200,
            message: 'Driver Detail Fetch Successful',
            jsonData: {
                driver: rows[0]
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve driver details service');
    }

};

