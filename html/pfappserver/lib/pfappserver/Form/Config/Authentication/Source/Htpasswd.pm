package pfappserver::Form::Config::Authentication::Source::Htpasswd;

=head1 NAME

pfappserver::Form::Config::Authentication::Source::Htpasswd - Web form for a htpasswd user source

=head1 DESCRIPTION

Form definition to create or update a htpasswd user source.

=cut

use HTML::FormHandler::Moose;
extends 'pfappserver::Form::Config::Authentication::Source';
with 'pfappserver::Base::Form::Role::Help';

# Form fields
has_field 'path' =>
  (
   type => 'Text',
   label => 'File Path',
   required => 1,
   element_class => ['input-xxlarge'],
  );
has_field 'stripped_user_name' =>
  (
   type            => 'Toggle',
   checkbox_value  => 'yes',
   unchecked_value => 'no',
   default         => 'yes',
   label           => 'Use stripped username ',
   tags => { after_element => \&help,
             help => 'Use stripped username returned by RADIUS to test the following rules.' },
  );
has_field 'use_mandatory_fields' => (
    type => 'Toggle',
    checkbox_value => 'yes',
    unchecked_value => 'no',
    label => 'Use mandatory fields',
    default => pf::Authentication::Source::HtpasswdSource->meta->get_attribute('use_mandatory_fields')->default,
    tags => {
        after_element => \&help,
        help => 'If enabled then the mandatory fields defined on the portal profile will be mandatory.',
    },
);
=head2 validate

Make sure the htpasswd file is readable.

=cut

sub validate {
    my $self = shift;

    $self->SUPER::validate();

    unless (-r $self->value->{path}) {
        $self->field('path')->add_error("The file is not readable.");
    }
}

=head1 COPYRIGHT

Copyright (C) 2005-2015 Inverse inc.

=head1 LICENSE

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301,
USA.

=cut

__PACKAGE__->meta->make_immutable;
1;
