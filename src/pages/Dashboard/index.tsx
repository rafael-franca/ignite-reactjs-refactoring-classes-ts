import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export default function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      api.get(
        '/foods'
      ).then(
        response => setFoods(response.data)
      );
    }

    loadData();
  }, []);

  const handleAddFood = async (food: Omit<IFood, 'id' | 'available'>): Promise<void> => {
    try {
      api.post(
        '/foods',
        {
          ...food,
          available: true,
        }
      ).then(
        response => setFoods([...foods, response.data])
      );
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Omit<IFood, 'id' | 'available'>): Promise<void> => {
    try {
      api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      ).then(
        response => response.data
      ).then(
        response => {
          const foodsUpdated = foods.map(food =>
            food.id !== response.id ? food : response,
          );

          setFoods(foodsUpdated);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: Number): Promise<void> => {
    try {
      api.delete(
        `/foods/${id}`
      ).then(
        response => response.data
      ).then(
        response => {
          const foodsFiltered = foods.filter(
            food => food.id !== id
          );

          setFoods(foodsFiltered);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const toggleModal = (): void => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: IFood): void => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(
            food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            )
          )
        }
      </FoodsContainer>
    </>
  )
}
