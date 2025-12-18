import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { RowDataPacket, FieldPacket } from "mysql2";

// SERVICE BOOKING COUNTS
export const bookingDashboardCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(booking_id) AS total_bookings,
            COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS completed_bookings,
            COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_bookings,
            COUNT(CASE WHEN booking_status = 1 THEN 1 END) AS new_bookings
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

// SERVICE BOOKING COUNTS
export const policeDashboardCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(police_id) AS police_total,
            COUNT(CASE WHEN police_duty_status = 'ON' THEN 1 END) AS onDuty_police,
            COUNT(CASE WHEN police_duty_status = 'OFF' THEN 1 END) AS offDuty_police,
            COUNT(CASE WHEN police_status = 1 THEN 1 END) AS active_police
            FROM police
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Police status counts fetched successfully",
            jsonData: {
                police_status_counts: rows[0]
            }
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed To Load Police Counts");
    }
};

// DRIVER DASHBOARD COUNTS 
export const driverDashboardCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(driver_id) AS driver_total,
            COUNT(CASE WHEN driver_duty_status = 'ON' THEN 1 END) AS onDuty_driver,
            COUNT(CASE WHEN driver_duty_status = 'OFF' THEN 1 END) AS offDuty_driver,
            COUNT(CASE WHEN driver_status = 1 THEN 1 END) AS active_driver
            FROM driver
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Driver status counts fetched successfully",
            jsonData: {
                driver_status_counts: rows[0]
            }
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed To Load Driver Counts");
    }
};

// HOSPITAL DASHBOARD COUNTS
export const hospitalDashboardCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(hospital_id) AS hospital_total,
            COUNT(CASE WHEN hospital_service_status = 0 THEN 1 END) AS available_247_hospital,
            COUNT(CASE WHEN hospital_service_status = 1 THEN 1 END) AS unavailable_hospital,
            COUNT(CASE WHEN hospital_status = 0 THEN 1 END) AS varified_hospital
            FROM hospital_lists
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Hospital status counts fetched successfully",
            jsonData: {
                hospital_status_counts: rows[0]
            }
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Failed To Load Hospital Counts");
    }
};

// MAP LOCATION DASHBOARD COUNTS
export const mapLocationDashboardCounts = async () => {
    try {

        let policeQuery = `
        SELECT 
            police.police_id, 
            police.police_name, 
            police.police_mobile, 
            police_live_location.police_live_location_lat, 
            police_live_location.police_live_location_long
        FROM police_live_location
        LEFT JOIN police ON police_live_location.police_live_location_d_id = police.police_id
        `;

        // WHERE police.police_duty_status = 'ON'

        let driverQuery = `
        SELECT 
            driver.driver_id, 
            driver.driver_name, 
            driver.driver_mobile, 
            driver_live_location.driver_live_location_lat, 
            driver_live_location.driver_live_location_long
        FROM driver_live_location
        LEFT JOIN driver ON driver_live_location.driver_live_location_d_id = driver.driver_id
        WHERE driver.driver_duty_status = 'ON'
        `;

        let bookingQuery = `
        SELECT 
            booking_id,
            booking_pick_lat,
            booking_pick_long,
            booking_drop_lat,
            booking_drop_long,
            booking_polyline
        FROM booking_view
        WHERE booking_view.booking_schedule_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;

        let hospitalQuery = `
        SELECT 
            hospital_id,
            hospital_name,
            hospital_lat,
            hospital_long
        FROM hospital_lists
        WHERE hospital_status = 0
        `;

        const [policeRows]: [RowDataPacket[], FieldPacket[]] = await db.query(policeQuery);
        const [driverRows]: [RowDataPacket[], FieldPacket[]] = await db.query(driverQuery);
        const [bookingRows]: [RowDataPacket[], FieldPacket[]] = await db.query(bookingQuery);
        const [hospitalRows]: [RowDataPacket[], FieldPacket[]] = await db.query(hospitalQuery);

        return {
            result: 200,
            message: "Map location counts fetched successfully",
            jsonData: {
                police_locations: policeRows,
                driver_locations: driverRows,
                booking_locations: bookingRows,
                hospital_locations: hospitalRows
            }
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Map Location Counts");
    }
}