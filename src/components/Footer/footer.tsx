import "./Footer.css";
import {
    Keyboard,
    MapPin,
    UserRound,
    CalendarDays,
} from "lucide-react";

interface FooterProps {
    branch?: string;
    terminal?: string;
    online?: boolean;
    username?: string;
    date?: string;
    time?: string;
}

export default function Footer({
    branch = "Main Branch",
    terminal = "POS-01",
    online = true,
    username = "Admin",
    date = "Sep 8, 2026"
}: FooterProps) {

    return (
        <footer className="pos-footer">

            {/* =========================================
                LEFT — KEYBOARD SHORTCUTS
            ========================================= */}

            <div className="footer-shortcuts">

                <div className="footer-shortcut">
                    <Keyboard size={15} />
                    <span>
                        <b>F2</b> - Search
                    </span>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-shortcut">
                    <span>
                        <b>F8</b> - Quotations
                    </span>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-shortcut">
                    <span>
                        <b>F9</b> - Checkout
                    </span>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-shortcut">
                    <span>
                        <b>F10</b> - Clear Cart
                    </span>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-shortcut">
                    <span>
                        <b>Esc</b> - Close Checkout
                    </span>
                </div>

            </div>


            {/* =========================================
                RIGHT — POS STATUS
            ========================================= */}

            <div className="footer-status">

                {/* BRANCH */}

                <div className="footer-info">
                    <MapPin size={15} />
                    <span>{branch}</span>
                </div>


                <div className="footer-divider"></div>


                {/* TERMINAL */}

                <div className="footer-info">
                    <span>{terminal}</span>
                </div>


                <div className="footer-divider"></div>


                {/* ONLINE */}

                <div
                    className={`footer-online ${online ? "online" : "offline"
                        }`}
                >
                    <span className="footer-status-dot"></span>
                    <span>
                        {online ? "Online" : "Offline"}
                    </span>
                </div>


                <div className="footer-divider"></div>


                {/* USER */}

                <div className="footer-info">
                    <UserRound size={15} />
                    <span>{username}</span>
                </div>


                <div className="footer-divider"></div>

                {/* DATE */}

                <div className="footer-datetime">
                    <CalendarDays size={15} />
                    <span>{date}</span>
                    {/* <strong>{time}</strong> */}
                </div>

            </div>

        </footer>
    );
}