import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Dashboard from '../pages/Dashboard';
import List from '../pages/List';
import Layout from '../components/Layout'

const AppRoutes: React.FC = () => (
  <Layout>
    <Switch>
      <Route path="/dashboard" exec component={Dashboard} />
      <Route path="/list/:type" exec component={List} />
    </Switch>
  </Layout>
)

export default AppRoutes;