import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';
import { currentUnixTime } from '../utils/current_unixtime';
import { uploadFileCustom } from '../utils/file_uploads';

// POLICE LIST SERVICE
export const getPoliceListService = async (filters: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'police.created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "police.police_status = 0",
                active: "police.police_status = 1",
                inActive: "police.police_status = 2",
                delete: "police.police_status = 3",
                verification: "police.police_status = 4",
                onDuty: "police.police_duty_status = ON",
                offDuty: "police.police_duty_status = OFF",
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

        const query = `

            SELECT 
                police.police_id,
                police.police_name,
                police.police_last_name,
                police.police_mobile,
                police.police_wallet_amount,
                police.police_created_by,
                police.police_created_partner_id,
                police.police_profile_img,
                police.created_at,
                police.police_status,
                partner.partner_f_name AS created_partner_name,
                partner.partner_mobile AS created_partner_mobile,
                (
                    SELECT remark_text
                    FROM remark_data
                    WHERE remark_police_id = police.police_id
                    ORDER BY remark_id DESC
                    LIMIT 1
                ) AS remark_text
            FROM police
            LEFT JOIN partner ON police.police_created_by = 1 AND police.police_created_partner_id = partner.partner_id
            ${finalWhereSQL}
            ORDER BY police.police_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM police ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Police List Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                police: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers services');
    }

};

interface PoliceData {
    police_name: string;
    police_last_name: string;
    police_mobile: number;
    police_dob: string;
    police_gender: string;
    police_city_id: number;
    police_created_by: number;
    police_created_partner_id: number;
    police_profile_img?: Express.Multer.File | null;
}

// ADD POLICE SERVICE
export const addPoliceService = async (policeData: PoliceData) => {
    try {

        let dobTimestamp: number | null = null;
        if (policeData.police_dob) {
            const t = Math.floor(new Date(policeData.police_dob).getTime() / 1000);
            dobTimestamp = Number.isFinite(t) && t > 0 ? t : null;
        }

        const police_profile = policeData.police_profile_img ? uploadFileCustom(policeData.police_profile_img, "/police") : null;

        const insertPoliceData: any = {
            police_name: policeData.police_name,
            police_last_name: policeData.police_last_name,
            police_mobile: policeData.police_mobile,
            police_dob: dobTimestamp,
            police_gender: policeData.police_gender,
            police_city_id: policeData.police_city_id,
            police_created_by: policeData.police_created_by,
            police_created_partner_id: policeData.police_created_partner_id,
            police_profile_img: police_profile,
            created_at: currentUnixTime(),
        }

        const query = `
            INSERT INTO police SET ?
        `;

        await db.query(query, insertPoliceData);

        return {
            status: 201,
            message: 'Police added successfully',
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to add police');
    }
};