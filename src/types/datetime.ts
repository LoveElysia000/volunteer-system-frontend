// Request payloads use two different time precisions:
// - DateOnlyString: filters/profile dates sent as YYYY-MM-DD
// - DateTimeSecondString: event timestamps sent as YYYY-MM-DD HH:mm:ss
export type DateOnlyString = string
export type DateTimeSecondString = string
