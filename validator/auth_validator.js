const zod = require("zod");

const registerSchema = z.object({
  first_name: z
    .string({ required_error: " Name is required " })
    .trim()
    .min(3, { message: "Name must be of at least 3 characters." }),

  last_name: z
    .string({ required_error: "Last Name is required" })
    .trim()
    .min(3, { message: "Last Name must be of at least 3 characters" }),

  email: z
    .stirng({ required_error: "Email is Required" })
    .trim()
    .email({ message: "Invalid email adress" })
    .min({ message: "Email must be of atleast 3 characters." }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be of at least 6 characters" }),
});

module.exports = registerSchema;
