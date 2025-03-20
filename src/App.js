import React,{ useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Bookings, Calendar,Customers, Kanban, Editor, ColorPicker } from './pages';
import './App.css';

import Advertisements from './pages/Advertisements';
import AddAdvertisement from './pages/AddAdvertisement';
import StoreAdd from './pages/StoreAdd';
import Stores from './pages/Stores';
import { useStateContext } from './contexts/ContextProvider';
import UpdateStore from './pages/UpdateStore';
import ModifyAdvertisement from './pages/ModifyAdvertisement';
import AddCompoPack from './pages/ComboPack/AddCompoPack';
import UpdateComboPack from './pages/ComboPack/UpdateComboPack';
import ComboPack from './pages/ComboPack/ComboPack';

import ScanParking from './pages/QRScanner/ScanParking';
import NewCalendar from './pages/NewCalendar';
import { AuthContext } from './helper/AuthContext';
import { useState } from 'react';
import Home from './pages/Home';


const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [authState, setAuthState] = useState("");

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <AuthContext.Provider value={{authState, setAuthState}}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent
              content="Settings"
              position="Top"
            >
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>

            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              {themeSettings && (<ThemeSettings />)}

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={(<Home />)} />
                <Route path="/ecommerce" element={(<Ecommerce />)} />

                {/* pages  */}
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/store" element={<Stores />} />
                <Route path="/advertisements" element={<Advertisements />} />
                <Route path="/users" element={<Customers />} />
                <Route path="/addStore" element={<StoreAdd/>}/>
                <Route path="/addAdvertisement" element={<AddAdvertisement/>}/>
                <Route path="/modifyAdvertisement/:id" element={<ModifyAdvertisement />} />
                <Route path="/updateStore/:id" element={<UpdateStore/>}/>

                {/*  */}
                <Route path="/combopack" element={<ComboPack/>}/>
                <Route path="/addCombopack" element={<AddCompoPack/>}/>
                <Route path="/modifyComboPack/:id" element={<UpdateComboPack/>}/>
                <Route path="/parking" element={<ScanParking />}/>

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/event" element={<Calendar />} />
                <Route path="/Event" element={<NewCalendar />} />
                <Route path="/color-picker" element={<ColorPicker />} />


              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
