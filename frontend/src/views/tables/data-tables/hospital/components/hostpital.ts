import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
import { formatDate } from "@/components/DateFormat";

type HospitalInfoType = {
    hospital_id: number
    hospital_name: string
    hospital_logo: string
    hospital_contact_no: string
    city_name: number
    hospital_added_timestamp: string
    hospital_status: string
}

type TableType<T> = {
    header: string[]
    body: T[]
}

let hospitalRows: HospitalInfoType[] = [];

export const getHospitalList = async () => {
    try {
        const response = await axios.get(`${baseURL}/hospital/hospital_list`);
        hospitalRows = response.data?.jsonData?.hospital_lists || [];
        return hospitalRows;
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        throw error;
    }
}

export const hospitalColumns = [
    { data: 'hospital_id' },
    {
        data: 'hospital_logo',
        render: (data: string | "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-photo-image-illustration-285843601.jpg") => {
            return data ? `<img src="${data} " alt="hospital" class="rounded-circle" width="40" height="40" />` : '';
        }
    },
    { data: 'hospital_name' },
    { data: 'hospital_contact_no' },
    { data: 'city_name' },
    {
        data: 'hospital_added_timestamp',
        render: (data: string) => {
            return formatDate(data) || ' ';
        }
    },
    {
        data: 'hospital_status',
        render: (data: string) => {
            const statusMap: Record<string, { label: string; class: string }> = {
                "0": { label: 'Verified', class: 'success' },
                "1": { label: 'Blocked', class: 'danger' },
            };

            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const hospitalTableData: TableType<HospitalInfoType> = {
    header: ['S.No.', 'ID', 'Picture', 'Name', 'Contact', 'City', 'Date', 'Status'],
    body: hospitalRows,
};
