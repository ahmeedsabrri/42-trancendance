import Link from "next/link"
import CustomButton from "../../components/utils/CutsomButton"

const ExitButton = () => {
    return (
        <Link href={"/Games"}>
            <CustomButton
                label="EXIT"
                className="mt-48 text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
            />
        </Link>
        )
}

export default ExitButton;