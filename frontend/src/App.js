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
  faUnlock,
  // Edition
  faPencil,
  faGear,
  faTrash,
  faUpload,
  // Others
  faMobile,
  faRocket,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';

import AuthService from "./services/auth";
import { AuthContext, UserContext } from "./context/authContext";
import { UserBlogsContext } from "./context/blogsContext";
import NavBar from "./components/pure/NavBar";
import WelcomePage from "./components/pages/WelcomePage";
import NotFoundPage from "./components/pages/NotFoundPage";
import LoginPage from "./components/pages/auth/LoginPage";
import RegisterPage from "./components/pages/auth/RegisterPage";
import BlogsList from './components/pages/blogs/BlogsList';
import BlogPage from './components/pages/blogs/BlogPage';
import WriteBlog from "./components/pages/blogs/WriteBlog";
import UserPage from "./components/pages/users/UserPage";
import UserEditPage from "./components/pages/users/UserEditPage";
import PageLoader from "./components/pure/PageLoader";
import AuthVerify from "./models/authVerify";

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
  faUnlock,
  // Edition
  faPencil,
  faGear,
  faTrash,
  faUpload,
  // Others
  faMobile,
  faRocket,
  faNewspaper
)

function App() {
  const history = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userBlogs, setUserBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect (() => {
    const loginUser = async () => {
      setIsLoading(true);

      await AuthService.getCurrentUser().then(response => {
        const obtainedUser = response.data;
  
        if (obtainedUser) {
          setIsAuthenticated(true);
          setUser(obtainedUser);
        } else {
          setIsAuthenticated(false);
          setUser({});
        }
      }).catch(error => {
        console.error(error);
      });

      setIsLoading(false);
    };

    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      loginUser();
    }
  }, []);


  if (isLoading) {
    return <PageLoader />
  };


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


  // Definition of the paths based on when they're available
  const pathsWhenLogged = [...alwaysAuthorized(), ...authorizedWhenLogged()];
  const pathsWhenNotLogged = [...alwaysAuthorized(), ...authorizedWhenNotLogged()];


  return (
    <div className="App">
      <>
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <UserContext.Provider value={{user, setUser}}>
        <UserBlogsContext.Provider value={{userBlogs, setUserBlogs}}>
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

          <AuthVerify logOut={() => {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser({});
            setUserBlogs([]);
            history('/login');
          }} />
        </UserBlogsContext.Provider>
        </UserContext.Provider>
        </AuthContext.Provider>
      </>
    </div>
  );
}

export default App;
