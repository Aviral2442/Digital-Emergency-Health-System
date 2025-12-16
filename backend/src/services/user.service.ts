import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { currentUnixTime } from "../utils/current_unixtime";

// GET ALL USERS SERVICE
export const getAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows as any[];
};

// REMARK DATA INTERFACE
interface RemarkData {
  remark_type: number;
  remark_category_type: number;
  remark_text: string;
  remark_list_primary_key: number;
}

// CATEGORY → COLUMN MAPPING
const remarkColumnMap: Record<number, string> = {
  1: "remark_booking_id",
  2: "remark_airbooking_id",
  3: "remark_consumer_id",
  4: "remark_partner_id",
  5: "remark_driver_id",
  6: "remark_vehicle_id",
  7: "remark_hospital_id",
  8: "remark_consumer_dial_id",
  9: "remark_consumer_enquiry_records_id",
  10: "ambulance_enquire_id",
  11: "remark_manpower_vendor_id",
  12: "remark_manpower_order_id",
  13: "remark_driver_emergency_id",
  14: "remark_consumer_emergency_id",
  15: "remark_pathology_vendor_id",
  16: "remark_pathology_order_id",
  17: "remark_pathology_collection_boy_id",
  18: "remark_video_consultancy_order_id",
  19: "remark_video_consultancy_patient_id",
};

// ADD REMARK SERVICE
export const addRemarksById = async (remarkData: RemarkData) => {
  try {
    const columnName = remarkColumnMap[remarkData.remark_category_type];

    if (!columnName) {
      throw new ApiError(400, "Invalid remark category type");
    }

    // Prepare final insert object
    const remarkInsertData: any = {
      remark_type: remarkData.remark_type, // admin Id
      remark_category_type: remarkData.remark_category_type,
      remark_text: remarkData.remark_text,
      remark_add_unix_time: currentUnixTime(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Set only the target column
    remarkInsertData[columnName] = remarkData.remark_list_primary_key;

    // Insert
    const query = `INSERT INTO remark_data SET ?`;
    await db.query(query, remarkInsertData);

    return {
      status: 200,
      message: "Remark added successfully"
    };

  } catch (error) {
    console.error("Error in addRemarksById:", error);
    throw new ApiError(500, "Failed to insert remark");
  }
};

// GET REMARKS SERVICE BY ID
export const getRemarksById = async (columnName: string, primaryKey: number) => {
  try {

    const [rows]: any = await db.query(
      `SELECT ${columnName}, remark_type, remark_category_type, remark_text, remark_add_unix_time FROM remark_data 
         WHERE ${columnName} = ? 
         ORDER BY remark_id DESC`,
      [primaryKey]
    );

    return {
      status: 200,
      message: "Remarks fetched successfully",
      jsonData: {
        remarks_list: rows
      }
    };

  } catch (error) {
    throw new ApiError(500, "Failed to fetch remarks");
  }
};

// GET STATE SERVICE
export const getStateService = async () => {
  try {

    const [rows]: any = await db.query(
      `SELECT state_id, state_name FROM state ORDER BY state_name ASC`
    )

    return ({
      status: 200,
      message: "State list fetched successfully",
      jsonData: {
        state_list: rows
      }
    });

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Get State Service Error On Fetching");
  }
};

// GET CITY SERVICE
export const getCityService = async (stateId: number) => {
  try {

    if (isNaN(stateId)) {
      throw new ApiError(400, "Invalid State ID");
    }

    const [rows]: any = await db.query(
      `SELECT city_id, city_name FROM city WHERE city_state = ? ORDER BY city_name ASC`,
      [stateId]
    )

    return ({
      status: 200,
      message: "City list fetched successfully",
      jsonData: {
        city_list: rows
      }
    });

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Get City Service Error On Fetching");
  }
};
