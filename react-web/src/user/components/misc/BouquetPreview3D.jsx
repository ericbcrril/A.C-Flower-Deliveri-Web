// Importar React y el CSS necesario
import React from 'react';
import '../../styles/components/BouquetPreview.css';

const BouquetPreview3D = ({ flowers, accessories }) => {
    if (!flowers || !accessories) {
      return <p>Vista Previa no disponible</p>;
    }
  
    return (
      <div className="bouquet-preview-3d">
        <div className="bouquet">
          {flowers.map((flower, index) => (
            <div
              key={`flower-${index}`}
              className="flower"
              style={{
                backgroundColor: flower.color,
                transform: `translate(${flower.position.x}px, ${flower.position.y}px) scale(${flower.size})`,
                zIndex: flower.zIndex,
              }}
            ></div>
          ))}
          {accessories.map((accessory, index) => (
            <div
              key={`accessory-${index}`}
              className="accessory"
              style={{
                backgroundImage: `url(${accessory.imageUrl})`,
                transform: `translate(${accessory.position.x}px, ${accessory.position.y}px) scale(${accessory.size})`,
                zIndex: accessory.zIndex,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  

export default BouquetPreview3D;