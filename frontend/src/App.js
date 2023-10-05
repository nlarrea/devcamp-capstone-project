import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  // Page Icon
  faPaperPlane,
  // Searching
  faMagnifyingGlass,
  // Navigation
  faRightFromBracket,
  faRightToBracket,
  faChevronRight,
  faChevronLeft,
  faSpinner,
  // Auth form
  faUser,
  faAt,
  faLock,
  faLockOpen,
  // Others
  faMobile,
  faRocket,
  faNewspaper,
  faPencil
} from '@fortawesome/free-solid-svg-icons';

import WelcomePage from "./components/pages/WelcomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import LoginPage from "./components/forms/LoginPage";
import RegisterPage from "./components/forms/RegisterPage";
import BlogsList from './components/pages/blogs/BlogsList';
import BlogPage from './components/pages/blogs/BlogPage';
import UserPage from "./components/pages/users/UserPage";
import AuthContext from "./context/authContext";

library.add(
  // Page Icon
  faPaperPlane,
  // Searching
  faMagnifyingGlass,
  // Navigation
  faRightFromBracket,
  faRightToBracket,
  faChevronRight,
  faChevronLeft,
  faSpinner,
  // Auth form
  faUser,
  faAt,
  faLock,
  faLockOpen,
  // Others
  faMobile,
  faRocket,
  faNewspaper,
  faPencil
)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const history = useNavigate();

  /* TODO when database is done */
  useEffect (() => {
    if (!isAuthenticated) {
      history('/');
    }
    // if is false -> reset user data (remove it or something)
  }, [isAuthenticated, history]);

  /**
   * Function that stores some paths and their elements that are available
   * even when the user has not been logged in.
   * 
   * @returns {Array} - Some Routes available at any moment.
   */
  const alwaysAuthorized = () => {
    return [
      {
        path: '/blogs',
        element: <BlogsList />
      },
      {
        path: '/blogs/:blogId',
        element: <BlogPage />
      }
    ]
  }


  /**
   * Function that stores all the paths and their elements that are available
   * only when user has been logged in.
   * 
   * @returns {Array} - All the Route paths and elements.
   */
  const authorizedWhenLogged = () => {
    return [
      {
        path: '/users/me',
        element: <UserPage />
      },
      /*
      {
        path: '/users/me/edit',
        element: <UserEditPage user={user} />
      },
      {
        path: '/blogs/new-blog',
        element: <WriteBlog />
      },
      {
        path: '/blogs/edit-blog/:blogId',
        element: <WriteBlog />
      }
      */
    ];
  }


  /**
   * Function that stores all the paths and their elements that are available
   * only when user has not been logged in.
   * 
   * @returns {Array} - All the Route paths and elements.
   */
  const authorizedWhenNotLogged = () => {
    return [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      }
    ]
  }


  const pathsWhenLogged = [...alwaysAuthorized(), ...authorizedWhenLogged()];
  const pathsWhenNotLogged = [...alwaysAuthorized(), ...authorizedWhenNotLogged()];


  return (
    <div className="App">
      <>
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
          <Routes>
            <Route
              exact
              path='/'
              element={
                <WelcomePage />
              }
            />

            {
              isAuthenticated ? (
                pathsWhenLogged.map(({path, element}) => (
                  <Route
                    key={path}
                    path={path}
                    element={element}
                  />
                ))
              ) : (
                pathsWhenNotLogged.map(({path, element}) => (
                  <Route
                    key={path}
                    path={path}
                    element={element}
                  />
                ))
              )
            }

            <Route
              path='*'
              element={<NotFoundPage />}
            />
          </Routes>
        </AuthContext.Provider>
      </>
    </div>
  );
}

export default App;
