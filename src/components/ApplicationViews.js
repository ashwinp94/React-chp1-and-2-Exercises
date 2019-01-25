import { Route, Redirect } from 'react-router-dom'
import React, { Component } from "react"
import AnimalDetail from './animal/AnimalDetail'
import EmployeeDetail from './employee/EmployeeDetail'
import OwnerDetail from './owner/OwnerDetail'
import LocationDetail from './location/LocationDetail'
import OwnerList from './owner/OwnersList';
import AnimalList from './animal/AnimalList'
import EmployeeList from './employee/EmployeeList'
import LocationList from './location/LocationList'
import AnimalForm from './animal/AnimalForm'
import EmployeeForm from './employee/EmployeeForm'
import OwnerForm from './owner/OwnerForm'
import AnimalManager from '../modules/AnimalManager'
import EmployeeManager from '../modules/EmployeeManager'
import LocationManager from '../modules/LocationManager'
import OwnerManager from '../modules/OwnerManager'
import Login from './authentication/Login'





export default class ApplicationViews extends Component {
    state = {

        locations:[],
        animals: [],
        employees: [],
        owners: []
    }
    isAuthenticated = () => sessionStorage.getItem("credentials") !== null



        deleteAnimal = id => {
            return fetch(`http://localhost:5002/animals/${id}`, {
              method: "DELETE"
            })
              .then(response => response.json())
              .then(() => fetch(`http://localhost:5002/animals`))
              .then(response => response.json())
              .then(animals =>
                this.setState({
                  animals: animals
                })
              );
          };
          deleteOwner = id => {
            return fetch(`http://localhost:5002/owners/${id}`, {
              method: "DELETE"
            })
              .then(response => response.json())
              .then(() => fetch(`http://localhost:5002/owners`))
              .then(response => response.json())
              .then(owners =>
                this.setState({
                  owners: owners
                })
              );
          };
          deleteEmployee = id => {
            return fetch(`http://localhost:5002/employees/${id}`, {
              method: "DELETE"
            })
              .then(response => response.json())
              .then(() => fetch(`http://localhost:5002/employees`))
              .then(response => response.json())
              .then(employees =>
                this.setState({
                  employees: employees
                })
              );
          };

          addAnimal = animal =>
            AnimalManager.post(animal)
              .then(() => AnimalManager.getAll())
              .then(animals =>
                this.setState({
                  animals: animals
                })
              );

          addEmployee = (employee) =>
          EmployeeManager.post(employee)
            .then(() => EmployeeManager.getAll())
            .then(employees =>
              this.setState({
                employees: employees
              })
            );

          addOwner = owner =>
          OwnerManager.post(owner)
            .then(() => OwnerManager.getAll())
            .then(owners =>
              this.setState({
                owners: owners
              })
            );


            componentDidMount() {
                // Example code. Make this fit into how you have written yours.
                AnimalManager.getAll().then(allAnimals => {
                  this.setState({
                    animals: allAnimals
                  });
                });

                LocationManager.getAll().then(allLocations => {
                  this.setState({
                    locations: allLocations
                  });
                });

                EmployeeManager.getAll().then(allEmployees => {
                  this.setState({
                    employees: allEmployees
                  });
                });

                OwnerManager.getAll().then(allOwners => {
                  this.setState({
                    owners: allOwners
                  });
                });
              }

    render() {
        return (
            <React.Fragment>
                {/* login */}

                <Route path="/login" component={Login} />

                {/* locations */}

                <Route exact path="/locations" render={(props) => {
                 if (this.isAuthenticated()) {

                  return <LocationList locations={this.state.locations} />
                  } else {

                    return <Redirect to="/login" />
                }
                  }}/>

                <Route  path="/locations/:locationId(\d+)" render={(props) => {
                    return (<LocationDetail {...props} locations={this.state.locations} />)
                }} />

                {/* owners */}

                <Route exact path="/owners" render={(props) => {

                  if (this.isAuthenticated()) {
                    return <OwnerList {...props}  owners={this.state.owners}
                                                  deleteOwner={this.deleteOwner} />
                  } else {

                   return <Redirect to="/login" />
                  }
                }} />

                <Route path="/owners/new" render={(props) => {
                    return <OwnerForm {...props}   addOwner={this.addOwner}/>
                }} />

                <Route  path="/owners/:ownerId(\d+)" render={(props) => {
                    return <OwnerDetail {...props} deleteOwner={this.deleteOwner} owners={this.state.owners} />
                }} />

                {/* employees */}

                <Route exact path="/employees" render={props => {
                    if (this.isAuthenticated()) {

                    return <EmployeeList {...props} deleteEmployee={this.deleteEmployee}
                                        employees={this.state.employees}
                                        animals={this.state.animals}
                                        deleteAnimal={this.deleteAnimal}/>
                        } else {
                            return <Redirect to="/login" />
                        }
                    }} />
                <Route path="/employees/new" render={(props) => {
                    return <EmployeeForm {...props}   addEmployee={this.addEmployee}/>
                }} />

                <Route  path="/employees/:employeeId(\d+)" render={(props) => {
                    return <EmployeeDetail {...props} deleteEmployee={this.deleteEmployee} employees={this.state.employees} />
                }} />


                {/* animals */}

                <Route exact path="/animals" render={(props) => {
                    if (this.isAuthenticated()) {

                    return <AnimalList {...props} animals={this.state.animals}
                                                  deleteAnimal={this.deleteAnimal} />
                      } else {
                        return <Redirect to="/login" />
                    }
                }} />
                <Route path="/animals/new" render={(props) => {
                    return <AnimalForm {...props}   addAnimal={this.addAnimal}
                                                    employees={this.state.employees}/>
                }} />
                <Route path="/animals/:animalId(\d+)" render={(props) => {
                    return <AnimalDetail {...props} deleteAnimal={this.deleteAnimal}
                                                    animals={this.state.animals} />
                }} />

            </React.Fragment>
        )
    }
}
