import {z} from "zod";

export const projectSchema = z.object({
    id: z.coerce.number().int(), //id
    projectName: z.string() //κωδικός μελέτης
        .min(1, {error: "Ο κωδικός μελέτης είναι υποχρεωτικός"}),
        // .regex(/^[a-zA-Z0-9_-]+$/, {message: "Επιτρέπονται μόνο γράμματα, αριθμοί, - και _"}), //validation κωδικού
    description: z.string().nullable(),
    jobsCount: z.coerce.number().int()
})

export type Project = z.infer<typeof projectSchema>;