import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';

// HOSPITAL LIST SERVICE
export const getHospitalListService = async (filters: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    search?: string;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'hospital_lists.hospital_added_timestamp' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                varified: "hospital_lists.hospital_status = 0",
                block: "hospital_lists.hospital_status = 1",
                availableAllTime: "hospital_lists.hospital_service_status = 0",
                notAllTime: "hospital_lists.hospital_service_status = 1",
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

        if (noFiltersApplied) {
            effectiveLimit = limit;
            effectiveOffset = (page - 1) * limit;
        }

        if (filters?.search) {
            const searchTerm = `%${filters.search}%`;
            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += ` AND (hospital_lists.hospital_name LIKE ? OR hospital_lists.hospital_city_name LIKE ? OR hospital_lists.hospital_contact_no LIKE ?)`;
            } else {
                finalWhereSQL = `WHERE (hospital_lists.hospital_name LIKE ? OR hospital_lists.hospital_city_name LIKE ? OR hospital_lists.hospital_contact_no LIKE ?)`;
            }
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const query = `

            SELECT 
                hospital_lists.hospital_id,
                hospital_lists.hospital_name,
                hospital_lists.hospital_logo,
                hospital_lists.hospital_contact_no,
                hospital_lists.hospital_city_name,
                hospital_lists.hospital_added_timestamp,
                hospital_lists.hospital_status,
                (
                    SELECT remark_text
                    FROM remark_data
                    WHERE remark_hospital_id = hospital_lists.hospital_id
                    ORDER BY remark_id DESC
                    LIMIT 1
                ) AS remark_text
            FROM hospital_lists
            ${finalWhereSQL}
            ORDER BY hospital_lists.hospital_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM hospital_lists ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Hospital List Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                hospital_lists: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve hospital list');
    }

};

// HOSPITAL ALL DATA SERVICE
export const hospitalAllDataService = async (hospital_id: number) => {
    try {
        const query = `
            SELECT hospital_lists.*, hospital_users.hospital_users_name, hospital_users.hospital_users_mobile FROM hospital_lists
            LEFT JOIN hospital_users ON hospital_lists.hospital_user_id = hospital_users.hospital_users_id
            WHERE hospital_id = ?;
        `;
        const [rows]: any = await db.query(query, [hospital_id]);
        if (rows.length === 0) {
            throw new ApiError(404, 'Hospital not found');
        }
        return {
            status: 200,
            message: 'Hospital Data Fetch Successful',
            jsonData: rows[0]
        };
    } catch (error) {
        throw new ApiError(500, 'Failed to retrieve hospital data');
    }
};