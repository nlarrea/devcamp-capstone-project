import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
  faTrash,
  faUpload,
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
import { UserBlogsContext } from "./context/blogsContext";

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


  useEffect (() => {
    const login = async () => {
      await axios.get(
        'http://127.0.0.1:8000/users/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      ).then(response => {
        setIsAuthenticated(true);
        setUser(response.data);
      }).catch(error => {
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser({});
          setUserBlogs([]);
          history('/login');
        } else {
          console.error(error);
        }
      });
    };

    /* const getUserBlogs = async () => {
      await axios.get(
        `http://127.0.0.1:8000/blogs/${user.id}`, {
          headers: { Authorization: `Bearer ${storedToken}`}
        }
      ).then(response => {
        setUserBlogs([...response.data]);
      }).catch(error => {
        console.error('Error getting user blogs:', error);
      });
    }; */

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login();

      /* if (user.id) {
        getUserBlogs();
      } */
    } else {
      setIsAuthenticated(false);
      setUser({});
      history('/login');
    }
    // eslint-disable-next-line
  }, []);


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
        </UserBlogsContext.Provider>
        </UserContext.Provider>
        </AuthContext.Provider>
      </>
    </div>
  );
}

export default App;
