import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import random from 'random-string-generator';
import AccordionItem from '../../components/accordionItem/accordionItem';

import * as uiActions from '../../actions/uiActions';

import './tasks.css';

function Tasks() {
  let user = useSelector((state) => state.user.user);
  let active = useSelector((state) => state.ui.active);
  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (active !== 'tasks') {
      dispatch(uiActions.setActive('tasks'));
    }
  }, [active, dispatch]);

  if (!user) {
    history.push('/dashboard');
  }

  return (
    <div>
      {user ? (
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-10 col-lg-9 col-md-8 ml-auto mt-5">
                {/* Project details */}
                <div id="accordion">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="text-muted mb-4 mt-2 text-center">Assigned tasks</h4>
                      {user.assignedTasks.length > 0 ? (
                        <>
                          {user.assignedTasks.map((task) => (
                            <AccordionItem
                              unique={random('lower')}
                              key={task.id}
                              id={task.id}
                              title={task.title}
                              bg="primary"
                              button="View task"
                              link={`/tasks/${task.id}`}
                            >
                              <h5 className="card-title">
                                Task Deadline: {`${new Date(task.deadline).toLocaleDateString()}`}
                              </h5>
                              <p className="card-text text-secondary text-small">{task.description}</p>
                            </AccordionItem>
                          ))}
                        </>
                      ) : (
                        <p className="text-center">No assigned projects</p>
                      )}
                    </div>
                    <div className="col-12">
                      <h4 className="text-muted mb-4 mt-2 text-center">Tagged tasks</h4>
                      {user.tasks.length > 0 ? (
                        <>
                          {user.tasks.map((task) => (
                            <AccordionItem
                              unique={random('lower')}
                              key={task.id}
                              id={task.id}
                              title={task.title}
                              bg="secondary"
                              button="View task"
                              link={`/tasks/${task.id}`}
                            >
                              <h5 className="card-title">
                                Task Deadline: {`${new Date(task.deadline).toLocaleDateString()}`}
                              </h5>
                              <p className="card-text text-secondary text-small">{task.description}</p>
                            </AccordionItem>
                          ))}
                        </>
                      ) : (
                        <p className="text-center">No tagged projects</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="loader-div">
          <Loader type="Plane" color="#D40C7A" height={100} width={100} />
        </div>
      )}
    </div>
  );
}

export default Tasks;
