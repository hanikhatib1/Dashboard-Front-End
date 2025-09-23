import { Button } from "@/components/ui/button";
import React from "react";
import AccountInfo from "./AccountInfo";
import AccountPassword from "./AccountPassword";

const tabs = [
  { label: "Account Info", component: <AccountInfo /> },
  { label: "Account Password", component: <AccountPassword /> },
];

const Profile = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].label);
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              variant={activeTab === tab.label ? "default" : "outline"}
              onClick={() => setActiveTab(tab.label)}
              className={`capitalize ${
                activeTab === tab.label ? "bg-primary text-white" : ""
              } rounded-[8px]`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        {tabs.map(
          (tab) =>
            activeTab === tab.label && (
              <div key={tab.label}>{tab.component}</div>
            )
        )}
      </div>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
};

export default Profile;
