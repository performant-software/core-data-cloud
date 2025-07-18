// @flow

import { ListTable } from '@performant-software/semantic-components';
import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import React, {
  useContext,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { HiBuildingOffice, HiBuildingOffice2 } from 'react-icons/hi2';
import { useNavigate } from 'react-router';
import { Icon } from 'semantic-ui-react';
import ListViewMenu from '../components/ListViewMenu';
import MergeButton from '../components/MergeButton';
import OrganizationsService from '../services/Organizations';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import useSelectable from '../hooks/Selectable';
import Views from '../constants/ListViews';
import WindowUtils from '../utils/Window';

const Organizations: AbstractComponent<any> = () => {
  const [view, setView] = useState(Views.all);

  const { projectModel } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { projectModelId } = useParams();
  const { t } = useTranslation();

  const { isSelected, onRowSelect, selectedItems } = useSelectable();
  const { loading, userDefinedColumns } = useUserDefinedColumns(projectModelId, 'CoreDataConnector::ProjectModel');

  /**
   * Memo-izes the organizations columns.
   */
  const columns = useMemo(() => [{
    name: 'name',
    label: t('Organizations.columns.name'),
    sortable: true
  }, {
    name: 'uuid',
    label: t('Common.columns.uuid'),
    sortable: true,
    hidden: true
  }, ...userDefinedColumns], [userDefinedColumns]);

  if (loading) {
    return null;
  }

  return (
    <>
      <ListViewMenu
        icons={{
          all: (
            <Icon>
              <HiBuildingOffice2 />
            </Icon>
          ),
          owned: (
            <Icon>
              <HiBuildingOffice />
            </Icon>
          )
        }}
        onChange={(value) => setView(value)}
        value={view}
      />
      <ListTable
        actions={[{
          name: 'edit',
          icon: 'pencil',
          onClick: (organization) => navigate(`${organization.id}`)
        }, {
          accept: (organization) => PermissionsService.canDeleteRecord(projectModel, organization),
          icon: 'times',
          name: 'delete'
        }]}
        buttons={[{
          render: () => (
            <MergeButton
              attributes={[{
                name: 'uuid',
                label: t('Common.actions.merge.uuid')
              }, {
                name: 'organization_names',
                label: t('Organizations.actions.merge.names'),
                array: true,
                names: true,
                resolve: (organizationName) => organizationName.name
              }, {
                name: 'description',
                label: t('Organizations.actions.merge.description')
              }]}
              ids={selectedItems}
              key='merge'
              onLoad={(id) => (
                OrganizationsService
                  .fetchOne(id)
                  .then(({ data }) => data.organization)
              )}
              onSave={(organization) => (
                OrganizationsService
                  .mergeRecords(organization, selectedItems)
                  .then(({ data }) => data.organization)
              )}
              projectModelId={projectModelId}
              title={t('Organizations.actions.merge.title')}
            />
          )
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='organizations'
        columns={columns}
        isRowSelected={isSelected}
        key={view}
        onDelete={(organization) => OrganizationsService.delete(organization)}
        onLoad={(params) => (
          OrganizationsService
            .fetchAll({
              ...params,
              project_model_id: projectModelId,
              defineable_id: projectModelId,
              defineable_type: 'CoreDataConnector::ProjectModel',
              view
            })
            .finally(() => WindowUtils.scrollToTop())
        )}
        onRowSelect={onRowSelect}
        perPageOptions={[10, 25, 50, 100]}
        searchable
        session={{
          key: `organizations_${projectModelId}`,
          storage: localStorage
        }}
        selectable
      />
    </>
  );
};

export default Organizations;
