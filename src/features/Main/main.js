import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import SlideshowWithPagination from 'react-slideshow-with-pagination';
import { fetchClasses } from './mainSlice';

const Section = styled.section`
.item-wrapper {
  display: flex;
  flex-direction: row;
  height: 760px;
  overflow: hidden;
  margin-top:150px;
  }

.item-photo-wrapper {
  height: 60%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.item-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.item-details {
  height: 50%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  text-align: center;
}

.item-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.item-description {
  font-size: 14px;
  margin-bottom: 10px;
}

`;

const MainClasses = () => {
  const accessToken = useSelector((state) => state.session.accessToken);
  const classItems = useSelector((state) => state.addClassesReducer.classes);
  const classesStatus = useSelector((state) => state.addClassesReducer.status);
  const error = useSelector((state) => state.addClassesReducer.error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses(accessToken));
    }
  }, [classesStatus, dispatch]);

  const newClassTable = (classItem1, classItem2) => (
    <React.Fragment key={`${classItem1.id}-${classItem2 ? classItem2.id : 'null'}`}>
      <div className="item-card">
        <div className="item-photo-wrapper">
          <img className="item-photo" src={classItem1.photo} alt="Class" />
        </div>
        <div className="item-details">
          <div className="item-name">{classItem1.name}</div>
          <div className="item-description">{classItem1.description}</div>
        </div>
      </div>
      {classItem2 ? (
        <div className="item-card">
          <div className="item-photo-wrapper">
            <img className="item-photo" src={classItem2.photo} alt="Class" />
          </div>
          <div className="item-details">
            <div className="item-name">{classItem2.name}</div>
            <div className="item-description">{classItem2.description}</div>
          </div>
        </div>
      ) : (
        <div className="item-card" />
      )}
    </React.Fragment>
  );

  let content;

  if (classesStatus === 'succeeded') {
    const classPairs = [];
    for (let i = 0; i < classItems.length; i += 2) {
      const classItem1 = classItems[i];
      const classItem2 = classItems[i + 1] || null;
      classPairs.push([classItem1, classItem2]);
    }
    content = classPairs.length > 0 ? (
      <div className="item-wrapper">
        <div style={{ position: 'relative' }}>
          <SlideshowWithPagination
            option={classPairs}
            showNumbers
            showDots
            showArrows
            autoplay={false}
            cardWidth={400}
          >
            {classPairs.map(([classItem1, classItem2]) => newClassTable(classItem1, classItem2))}
          </SlideshowWithPagination>
        </div>
      </div>
    ) : ('');
  } else if (classesStatus === 'failed') {
    content = (
      <div>
        <h1>classes not found</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Section>
      {content}
    </Section>
  );
};

export default MainClasses;
