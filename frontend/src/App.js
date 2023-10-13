import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
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
  // Edition
  faPencil,
  faGear,
  // Others
  faMobile,
  faRocket,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons';

import { AuthContext, UserContext } from "./context/authContext";
import WelcomePage from "./components/pages/WelcomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import LoginPage from "./components/forms/LoginPage";
import RegisterPage from "./components/forms/RegisterPage";
import BlogsList from './components/pages/blogs/BlogsList';
import BlogPage from './components/pages/blogs/BlogPage';
import WriteBlog from "./components/pages/blogs/WriteBlog";
import UserPage from "./components/pages/users/UserPage";
import UserEditPage from "./components/pages/users/UserEditPage";
import NavBar from "./components/pure/NavBar";
import useToken from "./hooks/useToken";

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
  // Edition
  faPencil,
  faGear,
  // Others
  faMobile,
  faRocket,
  faNewspaper
)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const { token } = useToken();

  /* TODO when database is done */
  useEffect (() => {
    const login = () => {
      axios.get(
        'http://127.0.0.1:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).then(response => {
        setIsAuthenticated(true);
        setUser(response.data);
      }).catch(error => {
        console.error(error);
      })
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login();
    } else {
      setIsAuthenticated(false);
      setUser({});
    }
  }, [token, setIsAuthenticated, setUser]);

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
        element: <UserPage user={user} />
      },
      {
        path: '/users/me/edit',
        element: <UserEditPage />
      },
      {
        path: '/new-blog',
        element: <WriteBlog />
      },
      {
        path: '/edit-blog/:blogId',
        element: <WriteBlog />
      }
     
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
          <UserContext.Provider value={{user, setUser}}>
            <NavBar user={user} />

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
          </UserContext.Provider>
        </AuthContext.Provider>
      </>
    </div>
  );
}

export default App;
