export function calculatePetAge(birthDateString: string) {
    const today = new Date();
    const birthDate = new Date(birthDateString);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years <= 0) {
        return months === 1 ? "1 month" : `${months} months`;
    }

    if (months === 0) {
        return years === 1 ? "1 year" : `${years} years`;
    }

    return `${years} ${years === 1 ? "year" : "years"} ${months} ${months === 1 ? "month" : "months"
        }`;
}