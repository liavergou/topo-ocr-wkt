import {z} from "zod";

export const projectSchema = z.object({
    id: z.coerce.number().int(), //id
    code: z.string() //κωδικός μελέτης κατά iso
        .min(1, {error: "Ο κωδικός μελέτης είναι υποχρεωτικός"})
        .regex(/^[a-zA-Z0-9_-]+$/, {message: "Επιτρέπονται μόνο γράμματα, αριθμοί, - και _"}), //validation κωδικού
    description: z.string().optional(),
    is_active: z.boolean(),
    sort: z.coerce.number().int().nonnegative({error: "Must be a non-negative number"})
})

export type Project = z.infer<typeof projectSchema>;