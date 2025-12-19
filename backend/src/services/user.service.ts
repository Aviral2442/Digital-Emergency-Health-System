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

// GET ALL CITIES SERVICE
export const getCitiesService = async () => {
  try {

    const [rows]: any = await db.query(
      `SELECT city_id, city_name FROM city ORDER BY city_name ASC`,
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

// GET PARTNER SERVICES
export const getPartnerServices = async () => {

  try {

    const query = `
            SELECT 
                partner_id,
                partner_f_name,
                partner_l_name,
                partner_mobile,
                partner_wallet,
                partner_profile_img,
                partner_created_by,
                partner_city_id,
                partner_registration_step,
                created_at,
                partner_status
            FROM partner
            ORDER BY partner_id DESC;
        `;
    const [rows]: any = await db.query(query);

    return {
      status: 200,
      message: 'Partner List Fetch Successful',
      jsonData: {
        partners: rows
      }
    };

  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Failed to retrieve partner services');
  }

};

// GET STATE ID BY CITY ID SERVICE
export const getStateIdByCityIdService = async (cityId: number) => {
  try {

    const [rows]: any = await db.query(
      `SELECT city.city_state as state_id, state.state_name 
       FROM city 
       LEFT JOIN state ON city.city_state = state.state_id
       WHERE city.city_id = ?`,
      [cityId]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "City not found");
    }

    return {
      status: 200,
      message: 'State Fetch Successful',
      jsonData: {
        state_id: rows[0].state_id,
        state_name: rows[0].state_name
      }
    };

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Get State ID By City ID Service Error On Fetching");
  }
};
