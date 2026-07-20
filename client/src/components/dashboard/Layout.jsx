import { Outlet } from "react-router-dom";
import Header from "../../pages/dashboard/Header";
import { MdBiotech } from "react-icons/md";
import { Card, CardContent, CardHeader } from "../ui/card";


const DashboardLayout = () => {
  const user = JSON.parse(sessionStorage.getItem("user"))
  return (
    <section className="w-full">
      <div className="w-full flex">
        <aside className="w-full min-h-screen max-w-64">
          <Card className="">
            <CardHeader>
              <div className="w-full flex justify-center items-center py-5 border-b-2">
                <MdBiotech className="size-15 text-blue-500" />
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold">APPLICANT</h1>
                  <h3 className="text-sm tracking-widest leading-tight">
                    Managment
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
        </aside>
        <div className="w-full">
          <Header />
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;