import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ProfilePics} from './assets/json/ProfilePics.js';
import {CountryFlags} from './assets/json/CountryFlags.js';
import {CategoryIcons} from './assets/json/CategoryIcons.js';

// Main App component
const App = () => {
  const Tab = createMaterialTopTabNavigator();
  const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);
  const [isSearchFiltered, setIsSearchFiltered] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState();
  const [filteredSearch, setFilteredSearch] = useState();
  const [userData] = useState(require('./assets/json/userData.json'));

  // Function to handle search input
  const handleSearchText = text => {
    setFilteredSearch(text);
    setIsSearchFiltered(true);
    setIsCategoryFiltered(false);
    setFilteredCategory('');
  };

  // Function to reset filters
  const handleResetButton = () => {
    setIsSearchFiltered(false);
    setIsCategoryFiltered(false);
    setFilteredCategory('');
    setFilteredSearch('');
  };

  // Category header section with filter buttons and search bar
  const CategoryHeader = () => {
    const categories = [
      {name: 'Astrologer'},
      {name: 'Assistant'},
      {name: 'Makeup'},
      {name: 'Mehndi'},
      {name: 'Photographer'},
      {name: 'Singer'},
      {name: 'Engineer'},
    ]; // List of categories

    return (
      <View style={styles.header}>
        <View style={styles.categoryFilterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              width: '100%',
            }}
            contentContainerStyle={{flexDirection: 'row'}}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.name}
                onPress={() => {
                  setIsCategoryFiltered(true);
                  setIsSearchFiltered(false);
                  setFilteredCategory(category.name);
                }}
                style={
                  filteredCategory === category.name
                    ? [styles.selectedCategory, styles.categoryFilterIcon]
                    : styles.categoryFilterIcon
                }>
                <View style={styles.imageContainer}>
                  <Image
                    source={CategoryIcons[category.name]}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={styles.categoryFilterText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="black"
            onSubmitEditing={e => handleSearchText(e.nativeEvent.text)} // Handle search on text submit
          />
        </View>
        <Text style={{color: 'black'}}>
          {isSearchFiltered ? `Search Text: ${filteredSearch}` : ''}
          {isCategoryFiltered ? `Category: ${filteredCategory}` : ''}
        </Text>
        {(isSearchFiltered || isCategoryFiltered) && (
          <TouchableOpacity
            onPress={handleResetButton}
            style={styles.resetButton}>
            <Text>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Body section displaying user profiles based on filters
  const CategoryBody = () => {
    return (
      <ScrollView>
        <View style={styles.userDataContainer}>
          {userData.users.map((user, index) => {
            // Check if user should be displayed based on search or category filter
            const showUser = isCategoryFiltered
              ? user.category === filteredCategory
              : isSearchFiltered
              ? user.name.includes(filteredSearch) ||
                user.category.includes(filteredSearch)
              : true;

            // Display user if the filter conditions are met
            if (showUser) {
              return (
                <View key={user.id} style={styles.user}>
                  <View style={styles.profilePicContainer}>
                    <Image
                      source={ProfilePics[user.id - 1].image}
                      style={styles.profilePic}
                    />
                    <Image
                      source={CategoryIcons[user.category]}
                      style={styles.categoryIconsAtProfilePic}
                    />
                    <Image
                      source={CountryFlags[user.countryCode]}
                      style={styles.countryFlagIcon}
                    />
                  </View>
                  <Text style={styles.userDataText}>{user.name}</Text>
                </View>
              );
            }
          })}
        </View>
      </ScrollView>
    );
  };

  // Category screen displaying the header and filtered user profiles
  const CategoriesScreen = () => {
    return (
      <View style={{height: '100%', width: '100%', paddingBottom: 10}}>
        <CategoryHeader />
        <CategoryBody />
      </View>
    );
  };

  // Welcome screen component
  const WelcomeScreen = () => (
    <View>
      <Text style={styles.welcomeText}>Welcome</Text>
    </View>
  );

  // Main navigation setup with two tabs: Welcome and Category
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 12},
          tabBarIndicatorStyle: {backgroundColor: 'orange'},
        }}>
        <Tab.Screen name="Welcome" component={WelcomeScreen} />
        <Tab.Screen name="Category" component={CategoriesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  header: {
    backgroundColor: 'powderblue',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchBar: {
    backgroundColor: 'white',
    height: 40,
    width: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    marginVertical: 10,
  },
  searchInput: {
    paddingLeft: 20,
    color: 'black',
  },
  categoryFilterBar: {
    flexDirection: 'row',
    width: '90%',
  },
  categoryFilterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedCategory: {
    borderColor: 'orange',
    borderWidth: 1.5,
  },
  categoryFilterText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1.5,
    backgroundColor: 'white',
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  resetButton: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  userDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  profilePicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 65,
    borderRadius: 50,
    borderWidth: 1,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  categoryIconsAtProfilePic: {
    width: 17,
    height: 17,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  countryFlagIcon: {
    width: 17,
    height: 17,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  userDataText: {
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
  },
  user: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  welcomeText: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 300,
    color: 'black',
  },
});

export default App;
