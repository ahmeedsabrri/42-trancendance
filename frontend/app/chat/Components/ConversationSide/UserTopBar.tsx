import UserComp from "./UserComp";

const UserTopBar = () => {

    return (
        <div className="w-full h-[10%] flex items-center justify-between absolute top-0 p-5">
                <UserComp />
        </div>
    )
}

export default UserTopBar;