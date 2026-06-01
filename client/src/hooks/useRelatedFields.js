import ProjectContext from '../context/Project';
import { useContext, useMemo, useState } from 'react';

const useRelatedFields = () => {
  const [relatedColumns, setRelatedColumns] = useState([])

  const { projectModel } = useContext(ProjectContext);

  const addRelatedColumn = (columnName) => {
    setRelatedColumns(prev => [...prev, columnName])
  }

  const removeRelatedColumn = (columnName) => {
    setRelatedColumns(prev => prev.filter(c => c !== columnName))
  }

  const relatedFields = useMemo(() => {
    const result = []
    projectModel?.all_project_model_relationships.forEach((relationship) => {
      const model = relationship.primary_model || relationship.related_model
      const isInverse = !!relationship.primary_model

      const nameColumn = `rel_${relationship.id}_name`

      result.push({
        name: nameColumn,
        label: `${isInverse ? relationship.inverse_name : relationship.name}`,
        hidden: true,
        onShow: () => addRelatedColumn(nameColumn),
        onHide: () => removeRelatedColumn(nameColumn),
        sortable: true
      })

      for (const udf of model.user_defined_fields) {
        const baseColumnName = `rel_${relationship.id}_udf_${udf.uuid}`
        const columnName = baseColumnName.replaceAll('-', '_')

        if (!result.some(c => c.name === columnName)) {
          result.push({
            name: columnName,
            label: `${isInverse ? relationship.inverse_name : relationship.name} → ${udf.column_name}`,
            hidden: true,
            onShow: () => addRelatedColumn(baseColumnName),
            onHide: () => removeRelatedColumn(baseColumnName),
            sortable: true
          })
        }
      }
    })

    return result
  }, [projectModel, addRelatedColumn, removeRelatedColumn]);

  const joinColumns = useMemo(() => {
    return relatedColumns.map(c => c.replace('udf_', 'udf.'))
  }, [relatedColumns])

  return { relatedFields, joinColumns }
};

export default useRelatedFields;