import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
import { formatDate } from "@/components/DateFormat";

type PoliceInfoType = {
    police_id: number
    police_name: string
    police_last_name: string
    police_mobile: string
    police_wallet_amount: number
    police_created_by: string
    police_created_partner_id: string
    police_profile_img: string
    created_at: string
    police_status: number
    created_partner_name: string
    created_partner_mobile: string
}

type TableType<T> = {
    header: string[]
    body: T[]
}

let policeRows: PoliceInfoType[] = [];

export const getPoliceList = async () => {
    try {
        const response = await axios.get(`${baseURL}/police/get_police_list`);
        policeRows = response.data?.jsonData?.police || [];
        return policeRows;
    } catch (error) {
        console.error("Error fetching police:", error);
        throw error;
    }
}

export const policeColumns = [
    { data: 'police_id' },
    {
        data: 'police_created_by',
        render: (data: string) => {
            switch(data) {
                case '0':
                    return 'Self';
                case '1':
                    return 'Partner';
                    default:
                    return 'Unknown';
            }
        }
    },
    {
        data: 'police_profile_img',
        render: (data: string | "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-photo-image-illustration-285843601.jpg") => {
            return data ? `<img src="https://appdata.medcab.in/${data} " alt="police" class="rounded-circle" width="20px" height="20px" loading="lazy" />` : '';
        }
    },
    { data: 'police_name',
        render: (data: string, _type: string, row: PoliceInfoType) => {
            return `${data} ${row.police_last_name}` || ' ';
        }
     },
     {
        data: 'created_partner_name',
        defaultContent:  '',
        render: (data: string, _type: string, row: PoliceInfoType) => {
            if(row.created_partner_name !== null ){
                return `${data} (${row.created_partner_mobile})` || ' ';
            }
        }
     },
    { data: 'police_mobile' },
    { data: 'police_wallet_amount' },
    {
        data: 'created_at',
        render: (data: string) => {
            return formatDate(data) || ' ';
        }
    },
    {
        data: 'police_status',
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
export const policeTableData: TableType<PoliceInfoType> = {
    header: ["S.No.", 'ID', 'By', 'Profile', 'Name', 'Created Partner', 'Mobile', 'Amount', 'Created', 'Status'],
    body: policeRows,
};
