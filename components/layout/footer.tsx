import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faGithub,
  faInstagram,
  faMediumM,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const navigation = {
  social: [
    {
      name: "Discord",
      href: "https://discord.com/invite/VjCHsa3WXm",
      icon: () => <FontAwesomeIcon icon={faDiscord} className="h-6 w-6" />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/TinyColonyGame",
      icon: () => <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/tinycolonygame/",
      icon: () => <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />,
    },
    {
      name: "Medium",
      href: "https://medium.com/@TinyColonyGame",
      icon: () => <FontAwesomeIcon icon={faMediumM} className="h-6 w-6" />,
    },
    {
      name: "GitHub",
      href: "https://github.com/tinycolony",
      icon: () => <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-indigo-50">
      <div className="max-w-7xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-indigo-600"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
