//import menuData from "data/navbarNavigation";

import menuData from "front-page/components/Header/menuData";



// MODIFY THE NAVIGATION WITH NEW STRUCTURE

export const updateNavigation = menuData.reduce((prev, curr) => {
  const newArr = [...prev];

  if (!curr.child) {
    newArr.push({ ...curr,
      extLink: true
    });
  } else if (curr.megaMenu || curr.megaMenuWithSub) {
    const flat = curr.child.flat();
    newArr.push({
      title: curr.title,
      child: flat
    });
  } else {
    newArr.push(curr);
  }

  return newArr;
}, []);