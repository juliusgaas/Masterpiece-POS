import "./Header.css";
import {
  ChevronDown,
  Bell,
  CircleHelp,
} from "lucide-react";

function Header({
  online = true,
  initials = "A",
  branch = "Main Branch",
  terminal = "POS-01",
  username = "Admin",
  notificationCount = 3,
}) {
  return (
    <header className="pos-header">

      {/* LEFT — BRAND */}
      <div className="header-left">
        <div className="brand">
          <div className="brand-logo">
            <img src="../../react.svg" alt="Logo" />
            {/* <div className="logo-shape">
              <img src="../../assets/icons8-box-64.png" alt="Logo" />
              <span></span>
              <span></span>
              <span></span>
            </div> */}
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

        {/* BRANCH */}
        <div className="branch-wrapper">
          <label>Branch:</label>

          <button className="branch-select">
            <span>{branch}</span>
            <ChevronDown size={15} />
          </button>
        </div>

        {/* TERMINAL */}
        <div className="terminal-info">
          <span className="terminal-label">Terminal:</span>
          <strong>{terminal}</strong>
        </div>

        {/* ONLINE STATUS */}
        <div className={`connection-status ${online ? "online" : "offline"}`}>
          <span className="status-dot"></span>
          {online ? "Online" : "Offline"}
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right">

        {/* NOTIFICATIONS */}
        <button className="header-action">
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

        {/* HELP */}
        <button className="header-action help-action">
          <CircleHelp size={21} strokeWidth={1.8} />
          <span>Help</span>
        </button>

        <div className="header-divider"></div>

        {/* USER */}
        <button className="user-menu">
          <div className="user-avatar">
            {initials}
          </div>

          <span className="username">
            {username}
          </span>

          <ChevronDown size={15} />
        </button>

      </div>
    </header>
  );
}

export default Header;