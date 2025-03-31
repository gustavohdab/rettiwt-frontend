import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            // Enforce using centralized types from /types directory
            "@typescript-eslint/no-shadow": "warn",
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "TSInterfaceDeclaration[id.name=/^(User|Tweet|Media|Profile|Auth)/]",
                    message:
                        "Define core types in /types directory, not in component files.",
                },
                {
                    selector:
                        "TSTypeAliasDeclaration[id.name=/^(User|Tweet|Media|Profile|Auth)/]",
                    message:
                        "Define core types in /types directory, not in component files.",
                },
            ],
        },
    },
];

export default eslintConfig;
