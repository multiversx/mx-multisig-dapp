import React from "react";
import { faTh } from "@fortawesome/pro-solid-svg-icons";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { isSidebarOpenSelector } from "redux/selectors/layoutSelector";

interface NavigationLinkType {
  name: string;
  link: string;
  icon: IconDefinition;
}

const links: NavigationLinkType[] = [
  { name: "Dashboard", link: "#", icon: faTh },
  { name: "Vault", link: "#", icon: faTh },
  { name: "Decisions", link: "#", icon: faTh },
  { name: "Organization", link: "#", icon: faTh },
  { name: "Tokens", link: "#", icon: faTh },
];

const secondaryLinks: NavigationLinkType[] = [
  { name: "FAQ", link: "#", icon: faTh },
  { name: "Documentation", link: "#", icon: faTh },
  { name: "End session", link: "#", icon: faTh },
];

function Sidebar() {
  const isSidebarOpen = useSelector(isSidebarOpenSelector);
  const [selectedLinkName, setSelectedLinkName] = React.useState("");

  const renderLink = (navigationLink: NavigationLinkType) => (
    <NavigationLink
      key={navigationLink.name}
      navigationLink={navigationLink}
      selected={selectedLinkName === navigationLink.name}
      onSelectLink={() => setSelectedLinkName(navigationLink.name)}
    />
  );

  return isSidebarOpen ? (
    <nav id="sidebar">
      <ul className="list components">
        {links.map(renderLink)}
        <hr className="my-5" />
        {secondaryLinks.map(renderLink)}
      </ul>
    </nav>
  ) : null;
}

function NavigationLink({
  navigationLink,
  selected,
  onSelectLink,
}: {
  navigationLink: NavigationLinkType;
  selected: boolean;
  onSelectLink: () => void;
}) {
  return (
    <li
      onClick={onSelectLink}
      className={clsx("sidebar-navigation-link", { selected: selected })}
    >
      <a className="sidebar-link" href={navigationLink.link}>
        <FontAwesomeIcon
          icon={navigationLink.icon}
          className="navigation-link-icon mx-4"
        />
        {navigationLink.name}
      </a>
    </li>
  );
}

export default Sidebar;
