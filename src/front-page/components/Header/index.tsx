"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import MobileHeader from "components/header/mobile-header";
import { HeaderWrapper, StyledContainer } from "components/header/styles";

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");

  const pathUrl = usePathname();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    const callback = (entries) => {
      const visibleEntry = entries.reduce((max, entry) => 
        entry.intersectionRatio > (max?.intersectionRatio || 0) ? entry : max
      , null);
  
      if (visibleEntry?.intersectionRatio > 0) {
        setCurrentSection(visibleEntry.target.id);
      }
    };
  
    const observer = new IntersectionObserver(callback, {
      rootMargin: '-100px 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
  
    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  const isActiveSection = (menuPath) => {
    // Remove leading slash and convert to lowercase for comparison
    const cleanPath = menuPath.replace(/^\//, '').toLowerCase();
    return currentSection.toLowerCase() === cleanPath;
  };

  const HEADER_FOR_LARGE_DEVICE = (
    <header
      className={`fixed left-0 top-0 z-99999 w-full py-7 ${
        stickyMenu
          ? "bg-white !py-4 shadow transition duration-100 dark:bg-black"
          : ""
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <Link href="/">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image 
                height={20} 
                src="/assets/images/logos/nctr-logo.png" 
                alt="logo" 
                width={100} 
                style={{ borderRadius: '10%' }} 
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }} />
            </div>
          </Link>
        </div>

        <div
          className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "navbar !visible mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10" style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu ? "group relative" : ""}>
                  {menuItem.submenu ? (
                    <>
                      <button
                        onClick={() => setDropdownToggler(!dropdownToggler)}
                        className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                      >
                        {menuItem.title}
                        <span>
                          <svg
                            className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </span>
                      </button>

                      <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
                        {menuItem.submenu.map((item, key) => (
                          <li key={key} className="hover:text-primary">
                            <Link href={item.path || "#"}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={menuItem.path}
                      className={`transition-colors duration-200 ${
                        isActiveSection(menuItem.path)
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary dark:text-gray-200"
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-7 flex items-center gap-6 xl:mt-0">
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
            >
              Console
            </Link>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    downMd ? (
      <HeaderWrapper>
        <StyledContainer>
          <MobileHeader searchInput={""} />
        </StyledContainer>
      </HeaderWrapper>
    ) : HEADER_FOR_LARGE_DEVICE
  );
};

export default Header;