import { redirect } from "next/navigation";
import Link from "next/link";

async function registerAction(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`${process.env.COFFEE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    }).catch(() => null);

    if (response?.status === 409) redirect("/register?error=exists");
    if (!response?.ok) redirect("/register?error=1");

    redirect("/login?registered=1");
}

type RegisterPageProps = {
    searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
    const { error } = await searchParams;

    return (
        <main>
            <h1>Crear cuenta</h1>
            {error === "exists" && <p role="alert">El email ya está registrado.</p>}
            {error === "1" && <p role="alert">Error al crear la cuenta. Intenta de nuevo.</p>}

            <form action={registerAction}>
                <p>
                    <label>
                        Email <input name="email" type="email" autoComplete="email" required />
                    </label>
                </p>
                <p>
                    <label>
                        Contraseña
                        <input name="password" type="password" autoComplete="new-password" required />
                    </label>
                </p>
                <button type="submit">Crear cuenta</button>
            </form>
            <p style={{ marginTop: "1rem" }}>
                <Link href="/login">Ya tengo cuenta. Iniciar sesión.</Link>
            </p>
        </main>
    );
}
