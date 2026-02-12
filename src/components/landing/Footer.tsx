import Link from "next/link";
import { APP_NAME, CONTACT_FORM } from "@/lib/constant";

const Footer = () => {
  return (
    <footer className="py-6 mt-auto">
      <div className="container flex justify-between mx-auto px-4 text-center">
        <p className="text-sm mb-4">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link
            className="hover:text-blue-600 transition-colors duration-300"
            href={CONTACT_FORM}
            rel="noopener noreferrer"
            target="_blank"
          >
            Contact founder
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
