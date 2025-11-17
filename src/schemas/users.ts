import {z} from "zod";

export const USER_ROLES = ['Admin', 'Manager', 'Member'] as const;


export const userCreateSchema = z.object({

    id: z.number().optional(), //id απο back

    username: z.string()
        .min(1, {message: "Το username είναι υποχρεωτικό"})
        .max(50, {message: "Το username πρέπει να είναι απο 1 έως 50 χαρακτήρες"}),

    password: z.string() //το εχω βαλει στο password policy του keycloak
        .min(8, {message: "Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες"})
        .regex(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W)^.{8,}$/, {message:"Το password πρέπει να περιέχει τουλάχιστον ένα μικρό και ένα κεφαλαίο γράμμα, έναν αριθμό και ένα ειδικό χαρακτήρα"})
        .optional(), //μόνο στο create

    email: z.email({ message: "Το email δεν είναι έγκυρο" })
        .min(1, {message: "Το email είναι υποχρεωτικό"})
        .max(100, {message: "Το email πρέπει να είναι απο 1 έως 100 χαρακτήρες"}),

    lastname: z.string()
        .min(1, {message:"Το επίθετο είναι υποχρεωτικό"})
        .max(50, {message:"Το επίθετο πρέπει να είναι απο 1 έως 50 χαρακτήρες"}),

    firstname: z.string()
        .min(1, {message:"Το όνομα είναι υποχρεωτικό"})
        .max(50, {message:"Το όνομα πρέπει να είναι απο 1 έως 50 χαρακτήρες"}),

    role: z.enum(USER_ROLES, {
        message: "Ο ρόλος είναι υποχρεωτικός και πρέπει να είναι Admin, Manager ή Member"
    }),
});

export const userUpdateSchema = z.object({
    email: z.email({ message: "Το email δεν είναι έγκυρο" })
        .min(1, {message: "Το email είναι υποχρεωτικό"})
        .max(100, {message: "Το email πρέπει να είναι απο 1 έως 100 χαρακτήρες"}),

    lastname: z.string()
        .min(1, {message:"Το επίθετο είναι υποχρεωτικό"})
        .max(50, {message:"Το επίθετο πρέπει να είναι απο 1 έως 50 χαρακτήρες"}),

    firstname: z.string()
        .min(1, {message:"Το όνομα είναι υποχρεωτικό"})
        .max(50, {message:"Το όνομα πρέπει να είναι απο 1 έως 50 χαρακτήρες"}),

    role: z.enum(USER_ROLES, {
        message: "Ο ρόλος είναι υποχρεωτικός και πρέπει να είναι Admin, Manager ή Member"
    }),
});

export type UserRole = (typeof USER_ROLES)[number]; //αυτοματη εξαγωγη απο το array. ειχα προβλημα με το z.infer<typeof userSchema>['role']
export type UserCreate = z.infer<typeof  userCreateSchema>;
export type UserUpdate= z.infer<typeof  userUpdateSchema>;