export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    experienceYears: number;
    hospital: string;
    about: string;
    avatar: string;
    availableDays: string[];
    consultationFee: number;
}