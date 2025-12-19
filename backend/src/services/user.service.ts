import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { currentUnixTime } from "../utils/current_unixtime";

// GET ALL USERS SERVICE
export const getAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows as any[];
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


export const getStateIdByCityIdService = async (cityId: number) => {
  try {

    if (isNaN(cityId)) {
      throw new ApiError(400, "Invalid City ID");
    }

    const [rows]: any = await db.query(
      `SELECT city_state FROM city WHERE city_id = ?`,
      [cityId]
    )

    if (rows.length === 0) {
      throw new ApiError(404, "City Not Found");
    }

    return ({
      status: 200,
      message: "State ID fetched successfully",
      jsonData: {
        state_id: rows[0].city_state
      }
    });

  } catch (error) {
    throw new ApiError(500, "Get State ID By City ID Service Error On Fetching");
  }
};