import {z} from "zod";

export const promptSchema = z.object({
    id: z.coerce.number().int(), //id
    promptName: z.string() //όνομα Prompt
        .min(1, {error: "Ο κωδικός μελέτης είναι υποχρεωτικός"})
        .max(200, {error:"Ο κωδικός μελέτης πρέπει να είναι απο 1 έως 200 χαρακτήρες"}),

    promptText: z.string(), //κειμενο prompt

})

export type Prompt = z.infer<typeof promptSchema>;