import Link from "next/link";
import FormsLogin from "../../components/formsLogin";


export default function LoginPage() {
    return (
        <main>
            <FormsLogin />

            <h1>Login</h1>
            <Link href="/cadastro">Ir para cadastro</Link>
        </main>

    );
}