import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { isDjAccount } from "@/firebase/utils";
import { AuthContext } from "@/contexts/AuthContext";
export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userId } = useContext(AuthContext);
  console.log(isDjAccount(userId));
  if (isDjAccount(userId)) {
    return (
      <>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
            tabBarShowLabel: true,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="listedDjs"
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              tabBarLabel: "Search",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search-outline" color={color} size={size} />
              ),
              href: null,
            }}
          />
          <Tabs.Screen
            name="manageBookings"
            options={{
              tabBarLabel: "Manage Bookings",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" color={color} size={size} />
              ),
              href: null,
            }}
          />
          <Tabs.Screen
            name={isLoggedIn ? "djprofile" : "login"}
            options={{
              tabBarLabel: isLoggedIn ? "Dj Profile" : "Login",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name={isLoggedIn ? "person-outline" : "log-in-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="djprofile/djprofile"
            options={{
              tabBarLabel: "Dj Profile",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }}
          />
          {/* <Tabs.Screen
            name="listedDjs"
            options={{
              tabBarLabel: "List of Djs",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" color={color} size={size} />
              ),
            }}
          /> */}
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="editdjprofile"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="djSignUp"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="userSignUp"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="bookdj"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </>
    );
  } else
    return (
      <Tabs>
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" color={color} size={size} />
            ),
            href: null,
          }}
        />
        <Tabs.Screen
          name="manageBookings"
          options={{
            tabBarLabel: "Manage Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
            href: null,
          }}
        />
        <Tabs.Screen
          name={isLoggedIn ? "djprofile" : "login"}
          options={{
            tabBarLabel: isLoggedIn ? "Dj Profile" : "Login",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={isLoggedIn ? "person-outline" : "log-in-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="listedDjs"
          options={{
            tabBarLabel: "List of Djs",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            href: null,
          }}
        />
        <Tabs.Screen
          name="editdjprofile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="djSignUp"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="userSignUp"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="bookdj"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="djprofile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
}
