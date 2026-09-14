export interface TimeSlot {
    id: string;
    time: string;   // HH:mm
    endTime: string; // HH:mm
    label: string;  // e.g., "09:00 AM"
    isAvailable: boolean;
}

/**
 * Generates 30-minute time slots between start and end hours.
 */
export const generateTimeSlots = (
    startHour: number = 9,
    endHour: number = 17,
    bookedSlots: string[] = []
): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            const timeStr = `${h}:${m}`;

            // Calculate end time
            let endH = hour;
            let endM = minute + 30;
            if (endM >= 60) {
                endH += 1;
                endM = 0;
            }
            const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

            // Format for display (12h format)
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const label = `${displayHour}:${m.padStart(2, '0')} ${ampm}`;

            slots.push({
                id: `slot-${timeStr}`,
                time: timeStr,
                endTime: endTimeStr,
                label,
                isAvailable: !bookedSlots.includes(timeStr),
            });
        }
    }

    return slots;
};