import {z} from "zod";

//create/update
export const projectBaseSchema = z.object({
    projectName: z.string() //κωδικός μελέτης
        .min(1, {error: "Ο κωδικός μελέτης είναι υποχρεωτικός"}),
        // .regex(/^[a-zA-Z0-9_-]+$/, {message: "Επιτρέπονται μόνο γράμματα, αριθμοί, - και _"}), //validation κωδικού
    description: z.string().nullable(),
});

export const projectSchema = projectBaseSchema.extend({
    id: z.coerce.number().int(), //id
    jobsCount: z.coerce.number().int()
});


export type ProjectBase = z.infer<typeof projectBaseSchema>
export type Project = z.infer<typeof projectSchema>;