
import "./Header.css";
import reactLogo from "../../assets/react.svg";
import {
  ChevronDown,
  Bell,
  CircleHelp,
  LogOut,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  online?: boolean;
  initials?: string;
  branch?: string;
  terminal?: string;
  username?: string;
  notificationCount?: number;
}

function Header({
  online = true,
  initials = "A",
  branch = "Main Branch",
  terminal = "POS-01",
  username = "Admin",
  notificationCount = 3,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");

    setShowUserMenu(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="pos-header">
      <div className="header-left">
        <div className="brand">
          <div className="brand-logo">
            <img src={reactLogo} alt="Logo" />
          </div>

          <div className="brand-text">
            <div className="brand-name">
              Masterpiece <span>POS</span>
            </div>
            <div className="brand-tagline">
              Sales&nbsp; • &nbsp;Inventory&nbsp; • &nbsp;Business Made Simple
            </div>
          </div>
        </div>

        <div className="branch-wrapper">
          <label>Branch:</label>
          <button type="button" className="branch-select">
            <span>{branch}</span>
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="terminal-info">
          <span className="terminal-label">Terminal:</span>
          <strong>{terminal}</strong>
        </div>

        <div className={`connection-status ${online ? "online" : "offline"}`}>
          <span className="status-dot"></span>
          {online ? "Online" : "Offline"}
        </div>
      </div>

      <div className="header-right">
        <button type="button" className="header-action">
          <div className="notification-icon">
            <Bell size={20} strokeWidth={1.8} />
            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </div>
          <span>Notifications</span>
        </button>

        <button type="button" className="header-action help-action">
          <CircleHelp size={21} strokeWidth={1.8} />
          <span>Help</span>
        </button>

        <div className="header-divider"></div>

        {/* USER DROPDOWN */}
        <div className="user-dropdown-wrapper">
          <button
            type="button"
            className="user-menu"
            onClick={() => setShowUserMenu((previous) => !previous)}
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <div className="user-avatar">{initials}</div>
            <span className="username">{username}</span>
            <ChevronDown
              size={15}
              className={showUserMenu ? "chevron-rotated" : ""}
            />
          </button>

          {showUserMenu && (
            <div className="user-dropdown-menu" role="menu">
              <div className="user-dropdown-heading">
                <UserRound size={17} />
                <span>{username}</span>
              </div>

              <div className="dropdown-divider"></div>

              <button
                type="button"
                className="dropdown-logout"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
