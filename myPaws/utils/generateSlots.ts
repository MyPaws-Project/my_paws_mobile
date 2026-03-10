
export type CalendarEvents = {
  time: string,
  petId: string,
  vetId: string,
};

export const mockDATA = {
  "random_id1": {
    time: "09:00",
    petId: "pet_id",
    vetId: "string"
  },
  "random_id3": {
    time: "11:00",
    petId: "pet_id",
    vetId: "string",
  },

  "random_id5": {
    id: "random_id5",
    time: "11:30",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id6": {
    time: "13:30",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id7":
  {
    time: "12:00",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id8": {
    time: "12:30",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id11": {
    time: "14:00",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id14": {
    time: "15:30",
    petId: "pet_id",
    vetId: "string",
  },
  "random_id16": {
    time: "16:30",
    petId: "pet_id",
    vetId: "string",
  },


  "random_id19": {
    time: "18:00",
    petId: "pet_id",
    vetId: "string",
  },
};

const bookedTimes = new Set(
  Object.values(mockDATA).map(item => item.time)
);

function generateSlots(start = 9, end = 18) {
  const slots = [];

  for (let h = start; h <= end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }

  return slots;
}

export const availableSlots = generateSlots().filter(time => !bookedTimes.has(time)).map((time, index) => ({
  id: index,
  time
}))

console.log(availableSlots)
