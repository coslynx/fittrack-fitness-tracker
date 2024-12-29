import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { Common } from './Common';
import PropTypes from 'prop-types';

const Goal = ({ goalId, onGoalUpdated }) => {
    const { token } = useAuth();
    const { data: goal, loading, error, fetchData } = useFetch(/api/goals/${goalId});
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState({});
    const [formError, setFormError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);


    useEffect(() => {
        fetchData();
    }, [fetchData]);


    useEffect(() => {
        if (goal) {
            setEditedGoal(goal);
        }
    }, [goal]);


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (goal) {
              setEditedGoal(goal);
        }
        setFormError(null);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedGoal({ ...editedGoal, [name]: value });
    };

    const validateForm = () => {
        if (!editedGoal.name || editedGoal.name.trim() === '') {
             setFormError('Goal name is required');
            return false;
        }
          if (!editedGoal.target || isNaN(editedGoal.target) || editedGoal.target <= 0) {
            setFormError('Target must be a valid positive number.');
            return false;
        }
         if (!editedGoal.unit || editedGoal.unit.trim() === '') {
             setFormError('Unit is required');
            return false;
        }
        setFormError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
             return;
        }


        setFormLoading(true);
           try {
             const response = await fetch(/api/goals/${goalId}, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${token},
                },
                body: JSON.stringify(editedGoal),
            });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update goal');
            }

             const updatedGoal = await response.json();
             setIsEditing(false);
              if (onGoalUpdated) {
                  onGoalUpdated(updatedGoal);
              }
             setFormError(null);


            } catch (error) {
                console.error('Error updating goal:', error);
                setFormError(error.message);
              } finally {
                  setFormLoading(false);
              }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return;
        }
        setFormLoading(true);
          try {
            const response = await fetch(/api/goals/${goalId}, {
                method: 'DELETE',
                headers: {
                    'Authorization': Bearer ${token},
                },
            });
               if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete goal');
            }
              if (onGoalUpdated) {
                onGoalUpdated(null);
            }


        } catch (error) {
            console.error('Error deleting goal:', error);
            setFormError(error.message);
        } finally {
             setFormLoading(false);
        }
    };

     if (loading) {
        return <Common.Loading />;
     }

     if(error){
          return <Common.Error message={error} />;
     }

    if (!goal) {
         return <Common.Error message="Goal not found." />;
    }

    return (
        <div className="bg-white shadow rounded p-4 mb-4">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                     {formError && <Common.Error message={formError} />}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Goal Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedGoal.name}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="target" className="block text-gray-700 text-sm font-bold mb-2">
                           Target
                        </label>
                         <input
                            type="number"
                            id="target"
                            name="target"
                            value={editedGoal.target}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                     </div>
                       <div>
                        <label htmlFor="unit" className="block text-gray-700 text-sm font-bold mb-2">
                           Unit
                        </label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            value={editedGoal.unit}
                            onChange={handleInputChange}
                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                       </div>
                     <div className="flex justify-end space-x-2">
                        <Common.Button type="button" onClick={handleCancelEdit} disabled={formLoading}  className="bg-gray-400 hover:bg-gray-500">
                           Cancel
                        </Common.Button>
                          <Common.Button type="submit" disabled={formLoading}>
                             {formLoading ? 'Saving...' : 'Save'}
                           </Common.Button>
                   </div>
                </form>
            ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">{goal.name}</h3>
                    <p className="text-gray-700">
                        Target: {goal.target} {goal.unit}
                    </p>
                     <div className="flex justify-end space-x-2">
                        <Common.Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700">
                            Edit
                        </Common.Button>
                        <Common.Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
                           Delete
                        </Common.Button>
                    </div>
               </div>
            )}
        </div>
    );
};

Goal.propTypes = {
    goalId: PropTypes.string.isRequired,
    onGoalUpdated: PropTypes.func,
};

export default Goal;