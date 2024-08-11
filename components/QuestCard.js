import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'src/styles/questcard.module.css';
import CompleteQuestButton from 'components/CompleteQuestButton';
import SaveQuestButton from 'components/SaveQuestButton';

const QuestCard = ({ quest, handleComplete, handleSave, onClose }) => {
  return (
    <div className={styles.questCardContainer}>
      <div key={quest.id} className="col mb-5">
        <div className="card h-100">
          <Image
            className="card-img-top"
            src={quest.imgUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"}
            alt={quest.title}
            width={450}
            height={300}
          />
          <div className="card-body p-4">
            <div className="text-center">
              <h5 className="fw-bolder">{quest.title}</h5>
              {quest.tags && (
                <div>
                  {quest.tags.map(tag => (
                    <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div className="text-center mb-2">
              <Link href={`/quest/${quest.id}`} legacyBehavior>
                <a className="btn btn-outline-dark mt-auto uniform-width">View Detail</a>
              </Link>
            </div>
            <div className="text-center mb-2">
              <CompleteQuestButton questId={quest.id} onComplete={handleComplete} className="uniform-width" />
            </div>
            <div className="text-center">
              <SaveQuestButton questId={quest.id} onSave={handleSave} />
            </div>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-outline-dark mt-2">Close</button>
      </div>
    </div>
  );
};

export default QuestCard;